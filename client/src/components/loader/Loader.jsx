import React from 'react';
import { Box, Typography } from '@mui/material';
import { keyframes } from '@emotion/react';

const rotate = keyframes`
  0% {
    transform: rotate(0deg) translateX(50px) rotate(0deg);
  }
  100% {
    transform: rotate(360deg) translateX(50px) rotate(-360deg);
  }
`;

const Loader = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="90vh"
    >
      <Box position="relative" width={200} height={120}>
        {/* Orbiting circle */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 12,
            height: 12,
            bgcolor: 'red',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            animation: `${rotate} 2s linear infinite`,
            transformOrigin: '0 0',
          }}
        />

        {/* Centered Waiting Text */}
        <Box
          position="absolute"
          top="50%"
          left="50%"
          sx={{
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Typography variant="h6" color="primary" sx={{color:"white"}}>
            Waiting...
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Loader;
