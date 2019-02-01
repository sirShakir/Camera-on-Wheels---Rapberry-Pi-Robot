#!/bin/bash
FILEPATH="$1"
ffmpeg \
	-f v4l2 \
		-framerate 25 -video_size 640x480 -i /dev/video0 -y -c:v copy $FILEPATH \
	-f mpegts \
		-codec:v mpeg1video -s 640x480 -b:v 1000k -bf 0 \
	http://localhost:3001
