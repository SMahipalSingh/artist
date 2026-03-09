import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'artishub_secret_key_dev', {
    expiresIn: '30d',
  });
};

export default generateToken;
