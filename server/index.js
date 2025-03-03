require('dotenv').config();
const PORT = process.env.PORT ?? 4000;
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const chalk = require('chalk');
const rateLimit = require('express-rate-limit');
const { logger } = require('./util/winstonLogger');
const { verifyToken } = require('./middlewares/verifyToken');

const borrowerSlipRoute = require('./routes/borrower_slip.routes');
const hardwareRoute = require('./routes/hardware.routes');
const laboratoryWeeklyUsage = require('./routes/laboratory_weekly_usage.routes');
const laboratoryOrientationRoute = require('./routes/laboratory_orientation.routes');
const noClassDaysRoute = require('./routes/no_class_days.routes');
const remarksRoute = require('./routes/after_usage_remarks.routes');
const schedulesRoute = require('./routes/schedules.routes');
const schoolYearRoute = require('./routes/sy_term_sem.routes');
const sotfwareRoute = require('./routes/software.routes');
const stockCardMISMRoute = require('./routes/stock_card_mism.routes');
const stockCardRoute = require('./routes/stock_card.routes');
const studentsRoute = require('./routes/students.routes');
const subjectsRoute = require('./routes/subjects.routes');
const teacherWeeklyUsage = require('./routes/instructor_weekly_usage.routes');
const utilzationsRoute = require('./routes/utilizations.routes');
const usersRoute = require('./routes/users.routes');
const wifiVoucherRoute = require('./routes/wifi_vouchers.routes');

const whitelist = [
  process.env.VITE_CLIENT_URL,
  process.env.LOCAL_HOST_IP,
  process.env.LOCAL_SERVER_URL,
  process.env.LOCAL_HOST_URL,
];

const app = express();
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: whitelist,
    credentials: true,
  },
});

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: 200, // Limit each IP to 70 requests per `window` (here, per 1 minute).
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
});

const socketMiddleware = require('./middlewares/socketIo');
// Initialize socket.io
socketMiddleware.init(io);

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', verifyToken, express.static(__dirname + '/uploads'));
app.use(helmet());
app.use(
  cors({
    credentials: true,
    origin: whitelist,
  })
);

app.use(limiter);

app.use(borrowerSlipRoute);
app.use(hardwareRoute);
app.use(laboratoryWeeklyUsage);
app.use(laboratoryOrientationRoute);
app.use(noClassDaysRoute);
app.use(remarksRoute);
app.use(schedulesRoute);
app.use(schoolYearRoute);
app.use(sotfwareRoute);
app.use(stockCardMISMRoute);
app.use(stockCardRoute);
app.use(studentsRoute);
app.use(subjectsRoute);
app.use(teacherWeeklyUsage);
app.use(utilzationsRoute);
app.use(usersRoute);
app.use(wifiVoucherRoute);

// Error handler
app.use((err, req, res, next) => {
  // const statusCode = err.statusCode || 500;
  const errorTitle = err.title;
  logger.error(chalk.red(`${errorTitle} :: ${err.stack}`));
  return res
    .status(500)
    .send(`Error: ${errorTitle || 'Internal Server Error'}`);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(chalk.cyan.bold(process.env.DBNAME)),
    console.log(chalk.green(`Server running on PORT ${PORT}`));
});
