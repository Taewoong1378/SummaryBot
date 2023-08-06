# SummaryBot 🤖

Give summary bot Korean transcription that you recorded in semiar or meeting. Summary bot will create summarization and write the summary in your google drive docs.

## How to run summary

### Create conda environment and install required packages

```bash
conda create --name summarybot --file requirement.txt
```

### Activate conda environment

```bash
conda activate summarybot
```

#### ☠️ If you face with error while installing...

- update conda to the latest version

```bash
conda update -n base -c defaults conda
```

- add additional channel to conda

```bash
conda config --add channels conda-forge
```

### OpenAI API Setup

It is important that you save your OpenAI API Key as environment variable in your system. The summary script WILL NOT run if it can't find OpenAI Key in your environment variable.

#### Mac OS

- Open your `bash_profile` script

```bash
vi ~/.bash_profile
```

- Add environment variable in `bash_profile`

```bash
export OPENAI_API_KEY="your-key"
```

- Apply update to the system

```bash
source ~/.bash_profile
```

### Run python script

`main.py` requires 3 arguments

1. Path where transcription text file exists
2. Type of summary. Should be either "qna" or "lecture"
3. Topic of the talk. Write topic in Korean such as "말 잘하기", "생성형 AI 알아보기", ...
4. Path where you want the output to be saved

Here is the sample command. Replace arguments with your specific needs.

```python
python3 main.py "./transcription/transcript.txt" "qna" "말 잘하기" "./output/transcript_summary.txt"
```

### Run Backend server

add your `OPENAI_API_KEY` and `SLACK_WEBHOOK_URL` in `.env` file and run the server by following command

```bash
pnpm dev
```
