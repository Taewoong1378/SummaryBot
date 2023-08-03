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

### Run python script
`main.py` requires 3 arguments

1. Path where transcription text file exists
2. Type of summary. Should be either "qna" or "lecture" 
3. Topic of the talk. Write topic in Korean such as "말 잘하기", "생성형 AI 알아보기", ...
 
Here is the sample command. Replace arguments with your specific needs. 
```python
python3 main.py "./transcription/transcript.txt" "qna" "말 잘하기"
```
