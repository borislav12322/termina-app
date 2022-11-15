import React, { useEffect, useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import Button from '../../components/button';
import Text from '../../components/text';
import Title from '../../components/title';
import { routesPaths } from '../../constans/routesPathes';
import { face } from '../../DAL/api';
import { App } from '../../store';

import s from './take-photo.module.css';

const TakePhoto = () => {
  const navigate = useNavigate();

  const regulaPhoto = App.useState(s => s?.app?.documentVisitorData?.Image?.image);
  const terminalPhoto = App.useState(s => s?.app?.terminalVisitorPhoto);

  const buttonHandle = e => {
    e.preventDefault();
    face
      .compare(`data:image/jpeg;base64,${regulaPhoto}`, terminalPhoto)
      .then((res, rej) => {
        console.log(res.data);
      })
      .catch(e => {
        navigate(routesPaths.repeatErrorPhotoResult);
      });
    // navigate('');
  };

  const videoRef = useRef(null);
  const photoRef = useRef(null);
  const stripRef = useRef(null);
  const colorRef = useRef(null);

  const [photo, setPhoto] = useState('');

  useEffect(() => {
    getVideo();
  }, [videoRef]);

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 300 } })
      .then(stream => {
        const video = videoRef.current;

        video.srcObject = stream;
        // video.play();
      })
      .catch(err => {
        console.error('error:', err);
      });
  };

  const paintToCanvas = () => {
    const video = videoRef.current;
    const photo = photoRef.current;
    const ctx = photo.getContext('2d');

    const width = 320;
    const height = 240;

    photo.width = width;
    photo.height = height;

    return setInterval(() => {
      const color = colorRef.current;

      ctx.drawImage(video, 0, 0, width, height);
      const pixels = ctx?.getImageData(0, 0, width, height);

      if (color) {
        color.style.backgroundColor = `rgb(${pixels.data[0]},${pixels.data[1]},${pixels.data[2]})`;
        color.style.borderColor = `rgb(${pixels.data[0]},${pixels.data[1]},${pixels.data[2]})`;
      }
    }, 100);
  };

  const [counter, setCounter] = useState(3);

  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isPhotoActive, setIsPhotoActive] = useState(false);

  const takePhoto = () => {
    setIsPhotoActive(false);
    setIsTimerActive(false);
    setCounter(3);

    const photo = photoRef.current;
    const strip = stripRef.current;

    const data = photo.toDataURL('image/jpeg');

    const link = document.createElement('a');

    setPhoto(data);
    App.update(s => {
      s.app.terminalVisitorPhoto = data;
    });

    link.href = data;
    link.setAttribute('download', 'myWebcam');
    link.innerHTML = `<img src='${data}' alt='thumbnail'/>`;
    strip.insertBefore(link, strip.firstChild);
  };

  useEffect(() => {
    let startTimer;

    if (isTimerActive) {
      startTimer = setInterval(() => {
        if (counter > 0 && counter !== 0) {
          setCounter(counter - 1);
        }
      }, 1000);
    }

    return () => clearInterval(startTimer);
  }, [counter, isTimerActive]);

  useEffect(() => {
    let takePhotoTimeOut;

    if (isPhotoActive) {
      takePhotoTimeOut = setTimeout(() => {
        takePhoto();
      }, 3000);
    }

    return () => clearTimeout(takePhotoTimeOut);
  }, [isPhotoActive]);

  return (
    <div className={s.takePhoto}>
      <div className={s.wrapper}>
        <Title text="Требуется сделать фото" />
        <div className={s.boxContent}>
          <div className={s.textInner}>
            <Text text="Проход осуществляется по двухфакторной аутентификации" />
            <Text text="Встаньте в зону распознавания камеры" />
          </div>
          <div className={s.videoBox}>
            <canvas ref={photoRef} className="photo" style={{ display: 'none' }} />
            <div className={s.videoInner}>
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video
                onCanPlay={() => paintToCanvas()}
                ref={videoRef}
                autoPlay
                playsInline
                className="player"
                style={{ display: !photo ? 'block' : 'none' }}
              />
              {isTimerActive && counter !== 0 && (
                <span className={s.counter}>{counter}</span>
              )}
            </div>

            {photo && <img className={s.visitorImage} src={photo} alt="фото" />}

            {!photo ? (
              <Button
                text="Сделать фото"
                type="button"
                paddingLeftRight="20px"
                id="takePhoto"
                onClick={() => {
                  setIsTimerActive(true);
                  setIsPhotoActive(true);
                }}
              />
            ) : (
              <Button
                text="Повторить"
                type="button"
                paddingLeftRight="20px"
                id="repeatPhoto"
                onClick={() => {
                  setPhoto('');
                  App.update(s => {
                    s.app.terminalVisitorPhoto = '';
                  });
                }}
                buttonWhite
              />
            )}
          </div>
        </div>
      </div>

      <Button
        text="Далее"
        type="button"
        paddingLeftRight="36px"
        onClick={buttonHandle}
        id="button_next"
      />
    </div>
  );
};

export default TakePhoto;
