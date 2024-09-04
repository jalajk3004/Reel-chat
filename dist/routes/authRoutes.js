"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const fetchUser_1 = __importDefault(require("../middleware/fetchUser"));
const userSchemas_1 = __importDefault(require("../models/userSchemas"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
const userRouter = express_1.default.Router();
// Register Route
userRouter.post('/register', [
    (0, express_validator_1.body)('username', 'Username must be at least 3 characters long').isLength({ min: 3 }),
    (0, express_validator_1.body)('password', 'Password must be at least 5 characters long').isLength({ min: 5 }),
    (0, express_validator_1.body)('email', 'Enter a valid email').isEmail(),
], (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let user = yield userSchemas_1.default.findOne({ username: req.body.username });
        if (user) {
            return res.status(400).json({ error: 'Username is already taken' });
        }
        user = yield userSchemas_1.default.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: 'Email is already registered' });
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const secPass = yield bcrypt_1.default.hash(req.body.password, salt);
        user = new userSchemas_1.default({
            username: req.body.username,
            email: req.body.email,
            password: secPass,
        });
        yield user.save();
        res.status(201).json({ message: 'User registered successfully', user });
    }
    catch (error) {
        next(error);
    }
}));
// Login Route
userRouter.post('/login', [
    (0, express_validator_1.body)('username', 'Username must be at least 3 characters long').isLength({ min: 3 }),
    (0, express_validator_1.body)('password', 'Password cannot be blank').exists(),
], (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { username, password } = req.body;
    try {
        const user = yield userSchemas_1.default.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }
        const passwordCompare = yield bcrypt_1.default.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }
        const token = jsonwebtoken_1.default.sign({ user: { id: user._id, username: user.username } }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1h' });
        console.log('Generated Token:', token); // Log the generated token
        res.status(200).json({ message: 'User logged in successfully', token, username: user.username });
    }
    catch (error) {
        next(error);
    }
}));
// Get User Route
userRouter.post('/getuser', fetchUser_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is missing' });
        }
        const user = yield userSchemas_1.default.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
}));
userRouter.get('/getusername', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.query.username; // Retrieve the username from query parameters
        if (!username) {
            return res.status(400).json({ error: 'Username is required for search' });
        }
        const user = yield userSchemas_1.default.findOne({ username }).select('-password'); // Exclude password from the response
        if (!user) {
            return res.status(404).json({ error: 'Account Not Found' });
        }
        res.json({ message: 'User found', user });
    }
    catch (error) {
        console.error('Error searching user:', error);
        res.status(500).json({ error: 'Internal server error' });
        next(error);
    }
}));
exports.default = userRouter;
