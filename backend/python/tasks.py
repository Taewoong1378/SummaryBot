import copy
import os
import re
import sys
import time

import openai
import tiktoken
from dotenv import load_dotenv
from prompt import type2prompt_messages  # PROMPTS
from tenacity import retry, stop_after_attempt, wait_random_exponential

MAX_TOKEN_SIZE = {
    "gpt-3.5-turbo" : 4096,
    "gpt4" : 8192
}
OUTPUT_TOKEN_SIZE = 1024
OFFSET = 250 # helping prompts

# Get absolute path to .env file
env_path = os.path.join(os.path.dirname(__file__), '../.env')

# load .env file
load_dotenv(env_path)

@retry(wait=wait_random_exponential(min=1, max=60), stop=stop_after_attempt(6))

def run_gpt(messages:list, max_output_token_length:int=512, model="gpt-3.5-turbo", temperature=1.0, frequency_penalty=0.2, presence_penalty=0.5):
    """Run OpenAI Chat Completion API"""
    try:
        response = openai.ChatCompletion.create(
                model=model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_output_token_length,
                frequency_penalty=frequency_penalty,
                presence_penalty=presence_penalty,
                )
        text_generated = response["choices"][0]["message"]["content"]

    except openai.error.RateLimitError as e:
        print(f"Rate limit exceeded. Waiting for 5 seconds...")
        time.sleep(5)

    except openai.error.Timeout as e:
        print(f"Request timed out. Retrying...")

    except openai.error.ServiceUnavailableError as e:
        time.sleep(5)
        print(f"Service not available. Waiting for 5 seconds...")

    return text_generated

def num_tokens_from_messages(messages, model="gpt-3.5-turbo-0613"):
    """Return the number of tokens used by a list of messages."""
    try:
        encoding = tiktoken.encoding_for_model(model)
    except KeyError:
        print("Warning: model not found. Using cl100k_base encoding.")
        encoding = tiktoken.get_encoding("cl100k_base")
    if model in {
        "gpt-3.5-turbo-0613",
        "gpt-3.5-turbo-16k-0613",
        "gpt-4-0314",
        "gpt-4-32k-0314",
        "gpt-4-0613",
        "gpt-4-32k-0613",
        }:
        tokens_per_message = 3
        tokens_per_name = 1
    elif model == "gpt-3.5-turbo-0301":
        tokens_per_message = 4  # every message follows <|start|>{role/name}\n{content}<|end|>\n
        tokens_per_name = -1  # if there's a name, the role is omitted
    elif "gpt-3.5-turbo" in model:
        # print("Warning: gpt-3.5-turbo may update over time. Returning num tokens assuming gpt-3.5-turbo-0613.")
        return num_tokens_from_messages(messages, model="gpt-3.5-turbo-0613")
    elif "gpt-4" in model:
        # print("Warning: gpt-4 may update over time. Returning num tokens assuming gpt-4-0613.")
        return num_tokens_from_messages(messages, model="gpt-4-0613")
    else:
        raise NotImplementedError(
            f"""num_tokens_from_messages() is not implemented for model {model}. See https://github.com/openai/openai-python/blob/main/chatml.md for information on how messages are converted to tokens."""
        )
    num_tokens = 0
    for message in messages:
        num_tokens += tokens_per_message
        for key, value in message.items():
            num_tokens += len(encoding.encode(value))
            if key == "name":
                num_tokens += tokens_per_name
    num_tokens += 3  # every reply is primed with <|start|>assistant<|message|>
    return num_tokens


def divide_long_segment_into_subsegment(segment:list, encoding, max_token_cnt:int):
    speaker_cnt = len(encoding.encode(segment[0]))
    speech = segment[1]

    total_token_cnt = 0
    text_segments = [[]]
    for text in speech.split("\n"):
        cur_token_cnt = len(encoding.encode(text))
        if total_token_cnt+cur_token_cnt >= (max_token_cnt+speaker_cnt):
            text_segments.append([text])
            total_token_cnt=cur_token_cnt
        else:
            text_segments[-1].append(text)
            total_token_cnt+=cur_token_cnt
    return [[segment[0], "\n".join(text_segment)] for text_segment in text_segments]

def chunk_transcription(processed_ts:list, model:str)->list:
    """Chunk transcription to meet maximum token size of GPT model"""
    encoding = tiktoken.encoding_for_model(model)

    text_chunks = []
    chunk_token_length = 0
    for segment in processed_ts:
        segment_token_length = len(encoding.encode(f"{segment[0]}: {segment[1]}\n"))

        if segment_token_length > (MAX_TOKEN_SIZE.get(model, "gpt-3.5-turbo")-OUTPUT_TOKEN_SIZE-OFFSET): # single chunk exceeded max token length
            subsegments = divide_long_segment_into_subsegment(segment, encoding, (MAX_TOKEN_SIZE.get(model, "gpt-3.5-turbo")-OUTPUT_TOKEN_SIZE-OFFSET))
            print(f"# subsegments: {len(subsegments)}")
            if len(text_chunks)>0: # if previous segment exists, save it
                print(f"Chunk [{len(text_chunks)}] | Total token length: {chunk_token_length}")
            
            # save len(subsegments)-1 part of subsegment into text_chunks
            i=0
            while i<len(subsegments)-1:
                text_chunks.append(f"{subsegments[i][0]}: {subsegments[i][1]}\n") 
                print(f'(Independent) Chunk [{len(text_chunks)}] | Total token length: {len(encoding.encode(f"{subsegments[i][0]}: {subsegments[i][1]}"))+1}')
                i+=1

            # reassgin segment with values from the last subsegment
            segment[0] = subsegments[-1][0]
            segment[1] = subsegments[-1][1]
            segment_token_length = len(encoding.encode(f"{segment[0]}: {segment[1]}\n"))
            text_chunks.append(f"{segment[0]}: {segment[1]}\n")
            chunk_token_length = segment_token_length
            continue

        if chunk_token_length + segment_token_length >= (MAX_TOKEN_SIZE.get(model, "gpt-3.5-turbo")-OUTPUT_TOKEN_SIZE-OFFSET): # create new chunk
            print(f"Chunk [{len(text_chunks)}] | Total token length: {chunk_token_length}")            
            text_chunks.append(f"{segment[0]}: {segment[1]}\n")
            chunk_token_length=segment_token_length
        else:
            if len(text_chunks) == 0:
                text_chunks.append(f"{segment[0]}: {segment[1]}\n")
            else:
                text_chunks[-1]+=f"{segment[0]}: {segment[1]}\n"
            chunk_token_length+=segment_token_length
    print(f"Chunk [{len(text_chunks)}] | Total token length: {chunk_token_length}")
    return text_chunks


def read_single_file(ts:str)->list:
    """Process(concatenate single speaker's speech) single transcript(`ts`) text into list"""
    processed_ts = [] # element = [speaker, text]
    for segment in ts.split("\n\n")[1:-1]: # Skip the first and the last segment that contain meta data of this meeting
        speaker_timestamp = segment.split("\n")[0]
        speaker = re.sub(r'[0-9]{2}:[0-9]{2}', '', speaker_timestamp).strip()

        transcript = " ".join([text.strip() for text in segment.split("\n")[1:]])

        if len(processed_ts)>0 and (processed_ts[-1][0] == speaker):
            processed_ts[-1][-1]+=("\n"+transcript)
        else:
            processed_ts.append([speaker, transcript])
    return processed_ts

def main(file_path:str, summary_type:str, topic:str, model:str):

    prompt_messages = type2prompt_messages.get(summary_type, "lecture")

    with open(file_path, "r") as reader:
        ts = reader.read()
    processed_ts = read_single_file(ts)
    text_chunks = chunk_transcription(processed_ts, model)
    
    summary_results = []
    for i, chunk in enumerate(text_chunks):
        cur_prompt_messages = copy.deepcopy(prompt_messages)
        cur_prompt_messages[-1]["content"] = cur_prompt_messages[-1]["content"].format(topic, chunk)

        prompt_token_cnt = num_tokens_from_messages(cur_prompt_messages, model)
        print(f"Chunk [{i+1}] | Total prompt token length: {prompt_token_cnt}")
        if prompt_token_cnt <= (MAX_TOKEN_SIZE.get(model, "gpt-3.5-turbo")-OUTPUT_TOKEN_SIZE):
            result = run_gpt(cur_prompt_messages, max_output_token_length=OUTPUT_TOKEN_SIZE, model=model, temperature=0.0)
            print(result, "\n"+"="*20+"\n")
            summary_results.append(result)
        else:
            print(f"Exceed token length. Skip current chunk. (i = {i})")

    return summary_results

def check_environment()->str:
    "Check for OpenAI API Key. If it exists, return available model"
    openai.api_key = os.getenv("OPENAI_API_KEY")
    if openai.api_key == "":
        print("OPENAI API KEY not provided. End the program.")
        sys.exit(1)
    
    # check if gpt4 model available
    model = "gpt-3.5-turbo"
    for model_dict in openai.Model.list()['data']:
        if model_dict["id"] == "gpt4":
            model = model_dict["id"]
    print(f"Current model: {model}")
    return model

def background_task(file_path:str, summary_type:str, topic:str, output_path:str):
    # 여기에 기존의 background_task 함수 내용을 넣습니다.
    model = check_environment()
    outputs = main(file_path, summary_type, topic, model)

    # Save output
    with open(f"{output_path}", "w", encoding="utf-8") as writer:
        output_txt = "\n\n".join(outputs)
        writer.write(output_txt)
    print(f"Summary Saved at {output_path}. End the program.")