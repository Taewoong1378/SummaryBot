import os
import sys

import redis
from dotenv import load_dotenv
from rq import Queue
from tasks import background_task

# Get absolute path to .env file
env_path = os.path.join(os.path.dirname(__file__), '../.env')

# load .env file
load_dotenv(env_path)

CUR_DIR = os.path.abspath(os.curdir)
sys.path.insert(0, CUR_DIR)
redis_url = os.getenv("REDIS_URL")
redis_conn = redis.from_url(redis_url)

if __name__ == "__main__":
    if len(sys.argv) == 5:
        file_path = sys.argv[1]
        summary_type = sys.argv[2]
        topic = sys.argv[3]
        output_path = sys.argv[4]

        # Set up RQ queue
        q = Queue(connection=redis_conn)
        job = q.enqueue(background_task, file_path, summary_type, topic, output_path)

        print(f"Job {job.id} added to queue. End the program.")
else:
    print(f"{sys.argv[0]} file_path('./transcript/fireside.txt') | summary_type('qna' | 'lecture') | topic('말 잘하기') | output_path('./output/summary.txt')")

