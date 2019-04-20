/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

'use strict';

const snapshotButton = document.querySelector('button#snapshot');
const filterSelect = document.querySelector('select#filter');

// Put variables in global scope to make them available to the browser console.
const video = window.video = document.querySelector('video');
const canvasVideo = document.querySelector('.mirror');
const slider = document.querySelector('.slider');
const sliderValue = document.querySelector('.sliderValue');
const ctx = canvasVideo.getContext('2d');
const canvas = window.canvas = document.querySelector('.photo');
let threshold = 100;
canvas.width = 480;
canvas.height = 360;

slider.addEventListener('input', updateSliderValue);
slider.addEventListener('change', updateSliderValue);

function updateSliderValue(e){
  const value = e.currentTarget.value;
  sliderValue.innerText = value;
  threshold = 0;
  //console.log('threshold', threshold);
}

snapshotButton.onclick = function() {
  canvas.className = filterSelect.value;
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
};

filterSelect.onchange = function() {
  video.className = filterSelect.value;
};

const constraints = {
  audio: false,
  video: true
};

function handleSuccess(stream) {
  window.stream = stream; // make stream available to browser console
  video.srcObject = stream;
  console.log('test handleSuccess');
  video.play().then(() =>{
    paintToCanvas();
  });
}

function handleError(error) {
  console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
}

navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);

function paintToCanvas(){
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvasVideo.width = width;
    canvasVideo.height = height;

    console.log('test paintToCanvas');

    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
        let pixels = ctx.getImageData(0,0, width, height);
        pixels = redEffect(pixels, threshold);
        ctx.putImageData(pixels, 0,0);
    }, 16);

}

function redEffect(pixels, threshold){
  console.log('threshold**', threshold);
  for(let i = 0; i < pixels.data.length; i+=4){
    pixels.data[i + 0] = pixels.data[i + 0] + threshold;
   // pixels.data[i + 1] = pixels.data[i + 1] - 50;
    //pixels.data[i + 2] = pixels.data[i + 2] * 0.5;
  }
  return pixels;
}