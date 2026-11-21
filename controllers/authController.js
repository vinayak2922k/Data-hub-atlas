const base64UrlEncode = (str) => {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

const login = (req, res) => {
  const { username, email, password } = req.body;
  const identifier = username || email;

  if (!identifier || !password) {
    return res.status(400).json({
      success: false,
      message: 'Username/email and password are required',
      data: null,
    });
  }

  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const payload = {
    sub: identifier,
    role: 'author',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  // Mock HMAC SHA256 signature representation
  const mockSignature = base64UrlEncode(`mock_signature_${identifier}_${Date.now()}`);

  const token = `${encodedHeader}.${encodedPayload}.${mockSignature}`;

  return res.status(200).json({
    success: true,
    message: 'Authentication successful',
    data: {
      token,
      tokenType: 'Bearer',
      expiresIn: 3600,
      user: {
        identifier,
      },
    },
  });
};

module.exports = {
  login,
};
