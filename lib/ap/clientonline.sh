#!/bin/bash

if [[ $2 == "AP-STA-CONNECTED" ]]
then
  paplay "/tmp/fluxspace/voice-incoming-transmission.wav"
fi
 
if [[ $2 == "AP-STA-DISCONNECTED" ]]
then
  paplay "/tmp/fluxspace/voice-disconnecting.wav"
fi
