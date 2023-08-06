#!/bin/bash

# Infinite while loop
while true
do 
	# Iterate from 1 to 5
	for ((i = 1; i <= 5; i++))
	do
		echo "Running fs_chat_$i.txt"
    		python3 main.py "./transcription/fs_chat_$i.txt" "qna" "말 잘하기" "output/summary$i.txt"
	done
done
