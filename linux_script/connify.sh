#!/bin/bash 
echo "connify";
#sudo sh -c 'echo "options snd-aloop index=2 pcm_substreams=1 id=Loopback" >> /etc/modprobe.d/alsa-aloop.conf'
sudo modprobe snd-aloop
pacmd load-module module-stream-restore restore_device=false
pacmd load-module module-alsa-sink device=hw:2,1
pacmd set-default-sink alsa_output.hw_2_1
