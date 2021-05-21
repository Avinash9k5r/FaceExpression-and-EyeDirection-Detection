const video = document.getElementById('video')
const faceExpression = document.getElementById('faceExpression')
let where = document.getElementById("where");
let model;
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const detectFaces = async () => {
  const prediction = await model.estimateFaces(video, false);

  //ctx.drawImage(video, 0, 0, 600, 400);



  prediction.forEach(pred => {

    /*
        ctx.fillStyle = "red";
    
        ctx.fillRect(pred.landmarks[0][0], pred.landmarks[0][1], 5, 5);
        ctx.fillRect(pred.landmarks[1][0], pred.landmarks[1][1], 5, 5);
    
        ctx.fillRect(pred.landmarks[4][0], pred.landmarks[4][1], 5, 5);
        ctx.fillRect(pred.landmarks[5][0], pred.landmarks[5][1], 5, 5);*/


    rightEye = pred.landmarks[0];
    leftEye = pred.landmarks[1];
    nose = pred.landmarks[2];
    rightEar = pred.landmarks[4];
    leftEar = pred.landmarks[5];

    /* console.log(nose[0] - rightEye[0]);*/

    if (nose[0] - rightEye[0] > 43) {
      where.textContent = "Up";
      console.log("Up");
    }

    if (nose[0] - rightEye[0] < 36) {
      where.textContent = "Down";
      console.log("down");
    }





    if ((rightEye[0] - rightEar[0]) < 35) {
      where.textContent = "Right";
      console.log("Right");
    }



    if ((rightEye[0] - rightEar[0]) > 45) {
      where.textContent = "Left";
      console.log("Left");
    }




  });





};


Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}


video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    /*faceapi.draw.drawDetections(canvas, resizedDetections)*/
    /* faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)*/
    //console.log(resizedDetections[0].expressions);
    const neutral = resizedDetections[0].expressions.neutral;
    const angry = resizedDetections[0].expressions.angry;
    const disgusted = resizedDetections[0].expressions.disgusted;
    const fearful = resizedDetections[0].expressions.fearful;
    const happy = resizedDetections[0].expressions.happy;
    const sad = resizedDetections[0].expressions.sad;
    const surprised = resizedDetections[0].expressions.surprised;


    const max = Math.max(neutral, angry, disgusted, fearful, happy, sad, surprised);

    if (max == neutral) {
      console.log("Neutral");
      faceExpression.textContent = "Neutral";
    }

    if (max == angry) {
      console.log("Angry");
      faceExpression.textContent = "Angry";
    }
    if (max == disgusted) {
      console.log("Disgusted");
      faceExpression.textContent = "Disgusted";
    }
    if (max == fearful) {
      console.log("Fearful");
      faceExpression.textContent = "Fearful";
    }
    if (max == happy) {
      console.log("Happy");
      faceExpression.textContent = "Happy";
    }
    if (max == sad) {
      console.log("Sad");
      faceExpression.textContent = "Sad";
    }
    if (max == surprised) {
      console.log("Surprised");
      faceExpression.textContent = "Surprised";
    }

    model = await blazeface.load();

    detectFaces();





  }, 100)
})






