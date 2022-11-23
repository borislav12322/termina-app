import React, { useEffect, useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import Button from '../../components/button';
import Text from '../../components/text';
import Title from '../../components/title';
import { routesPaths } from '../../constans/routesPathes';
import { dispenser, pass, photoPass } from '../../DAL/api';
import { App } from '../../store';

import s from './foundFace.module.css';

const FoundFace = () => {
  const navigate = useNavigate();

  const foundFacePassPhoto = App.useState(s => s?.app?.foundFacePassPhoto);

  const terminalPhoto = App.useState(s => s?.app?.terminalVisitorPhoto);

  const buttonHandle = async e => {
    e.preventDefault();
    try {
      const findedPass = await photoPass.find({ face_file: foundFacePassPhoto });

      if (findedPass) {
        try {
          navigate(routesPaths.passSuccess);

          const passInfo = await dispenser.card();

          await App.update(s => {
            s.app.dispenserInfo = passInfo;
          });

          if (passInfo?.data.status === 'empty bin') {
            await navigate(routesPaths.emptyBin);
            console.log('emptyBin');

            return;
          }

          if (passInfo?.data.status === 'gived') {
            await pass.rfid(findedPass.data.visitor_id, passInfo.data.rfid);

            return;
          }

          if (passInfo.data.status === 'took back') {
            await navigate(routesPaths.cardTakeAway);
            console.log('took back');

            return;
          }
        } catch (e) {
          navigate(routesPaths.cardTakeAway);
          console.log(e);
        }
      }
    } catch (e) {
      console.log(e);
      navigate(routesPaths.passNotFound);
    }
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
      s.app.foundFacePassPhoto = data;
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
    <div className={s.foundFace}>
      <div className={s.wrapper}>
        <Title text="Требуется сделать фото для поиска пропуска" />
        <div className={s.boxContent}>
          <div className={s.textInner}>
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
                    s.app.foundFacePassPhoto = '';
                  });
                }}
                buttonWhite
              />
            )}

            {foundFacePassPhoto && <Button text="Отправить" onClick={buttonHandle} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoundFace;
