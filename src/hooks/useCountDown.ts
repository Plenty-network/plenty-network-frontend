import { useEffect, useState } from 'react';
import { BigNumber } from 'bignumber.js';

const useCountdown = (targetDate: string | number) => {
  const countDownDate = new Date(targetDate).getTime();

  const [countDown, setCountDown] = useState(
    countDownDate - new Date().getTime()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDownDate - new Date().getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [countDownDate]);

  return getReturnValues(countDown);
};

const getReturnValues = (countDown: number) => {
  // calculate time left
  const days = new BigNumber(countDown / (1000 * 60 * 60 * 24))
    .decimalPlaces(0, 1)
    .toNumber();
  const hours = new BigNumber(
    (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  )
    .decimalPlaces(0, 1)
    .toNumber();
  const minutes = new BigNumber((countDown % (1000 * 60 * 60)) / (1000 * 60))
    .decimalPlaces(0, 1)
    .toNumber();
  const seconds = new BigNumber((countDown % (1000 * 60)) / 1000)
    .decimalPlaces(0, 1)
    .toNumber();

  return [days, hours, minutes, seconds];
};

export { useCountdown };
