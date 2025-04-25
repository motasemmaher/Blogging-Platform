// Mock User Model
export const mockUserModel = {
  findByEmail: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

// Mock Post Model
export const mockPostModel = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

// Mock Comment Model
export const mockCommentModel = {
  findByPostId: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
};

// Mock Token Model
export const mockTokenModel = {
  createRefreshToken: jest.fn(),
  findByToken: jest.fn(),
  deleteById: jest.fn(),
  deleteToken: jest.fn(),
};
