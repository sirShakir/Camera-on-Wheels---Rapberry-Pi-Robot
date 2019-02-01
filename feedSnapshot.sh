#!/bin/bash
FILEPATH="$1"
ffmpeg \
	-f video4linux2 -s 640x480 -i /dev/video0 -ss 0:0:2 -y -frames 1 $FILEPATH \
	-f mpegts \
		-codec:v mpeg1video -s 640x480 -b:v 1000k -bf 0 \
	http://localhost:3001