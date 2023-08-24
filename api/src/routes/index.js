const { Router } = require('express');
const registerRouter = require('./register');
const authRouter = require('./auth');
const refreshRouter = require('./refresh');
const logoutRouter = require('./logout');
const verifyJWT = require('../middlewares/verifyJWT');
const usersRouter = require('./resources/usersRouter');
const companiesRouter = require('./resources/companiesRouter');
const locationsRouter = require('./resources/locationsRouter');
const skillsRouter = require('./resources/skillsRouter');
// const organizationTypesRouter = require('./resources/organizationTypesRouter');

const router = Router();

// Auth Server
router.use('/register', registerRouter);
router.use('/auth', authRouter);
router.use('/refresh', refreshRouter);
router.use('/logout', logoutRouter);


// Resource Server
//router.use(verifyJWT);
router.use('/users', usersRouter);
router.use('/companies', companiesRouter);
router.use('/locations', locationsRouter);
router.use('/skills', skillsRouter);
// router.use('/organizationTypes', organizationTypesRouter);

module.exports = router;