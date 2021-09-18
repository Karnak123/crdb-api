const fs = require('fs');
const express = require('express');
const cors = require('cors');
const { urlencoded } = require('express');
const Sequelize = require('sequelize-cockroachdb');
require('dotenv').config();

const app = express();

app.use(express.json({ limit: '30mb', extended: true }));
app.use(urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = parseInt(process.env.DB_PORT);
const DATABASE = process.env.DATABASE;
const HOME = process.env.HOME;


const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 8000;

// Connect to the database
var sequelize = new Sequelize({
    dialect: 'postgres',
    username: USERNAME,
    password: PASSWORD,
    host: DB_HOST,
    port: DB_PORT,
    database: DATABASE,
    logging: false,
    dialectOptions: {
        ssl: {
            ca: fs.readFileSync(HOME + '/.postgresql/root.crt').toString()
        }
    }
});

// Define the models
const Events = sequelize.define('events', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    creator: {
        type: Sequelize.STRING, // use emailid
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING, // TEXT
        allowNull: false
    },
    start_time: {
        type: Sequelize.DATE,   // example "2021-09-18T19:17:13.709Z"
        allowNull: false
    },
    end_time: {
        type: Sequelize.DATE,   // example "2021-09-18T19:17:13.709Z"
        allowNull: false
    },
    location: {
        type: Sequelize.STRING, // example "Somewhere"
        allowNull: false
    },
    url: {
        type: Sequelize.STRING, // example "https://www.google.com"
        allowNull: false
    },
    tags: {
        type: Sequelize.ARRAY(Sequelize.STRING), // example ["tag1", "tag2"]
        allowNull: true
    },
    typeOfEvent: {
        type: Sequelize.STRING, // example "event"
        allowNull: false
    },
});


// Get all events
app.get('/events/', (req, res) => {
    Events.sync({ force: false }).then(() => {
        return Events.findAll();
    }).then((events) => {
        res.json(events);
    }).catch((err) => {
        res.json(err);
    });
});

// Get all events by creator
app.get('/events/creator/', (req, res) => {
    Events.sync({ force: false }).then(() => {
        return Events.findAll({
            where: {
                creator: req.body.creator
            }
        });
    }).then((events) => {
        res.json(events);
    }).catch((err) => {
        res.json(err);
    });
});

// Get all events containing a tag
app.get('/events/tag/', (req, res) => {
    Events.sync({ force: false }).then(() => {
        return Events.findAll({
            tags: req.body.tag
        });
    }).then((events) => {
        res.json(events);
    }).catch((err) => {
        res.json(err);
    });
});

// Get all events of a type
app.get('/events/type/', (req, res) => {
    Events.sync({ force: false }).then(() => {
        return Events.findAll({
            where: {
                typeOfEvent: req.body.typeOfEvent
            }
        });
    }).then((events) => {
        res.json(events);
    }).catch((err) => {
        res.json(err);
    });
});

// Get all events in a location
app.get('/events/location/', (req, res) => {
    Events.sync({ force: false }).then(() => {
        return Events.findAll({
            where: {
                location: req.body.location
            }
        });
    }).then((events) => {
        res.json(events);
    }).catch((err) => {
        res.json(err);
    });
});

// Add an event
app.post('/add/', (req, res) => {
    Events.sync({ force: false }).then(() => {
        return Events.create({
            creator: req.body.creator,
            name: req.body.name,
            description: req.body.description,
            location: req.body.location,
            start_time: req.body.start_time,
            end_time: req.body.end_time,
            url: req.body.url,
            tags: req.body.tags,
            typeOfEvent: req.body.typeOfEvent
        });
    }).then(() => {
        res.json({ message: 'Successfully added event' });
    }).catch((err) => {
        res.json(err);
    });
});

// Update event by id
app.post('/update/', (req, res) => {
    Events.sync({ force: false }).then(() => {
        Events.update({
            name: req.body.name,
            description: req.body.description,
            location: req.body.location,
            start_time: req.body.start_time,
            end_time: req.body.end_time,
            url: req.body.url,
            tags: req.body.tags,
            typeOfEvent: req.body.typeOfEvent
        }, {
            where: {
                id: req.body.id
            }
        });
    }).then(() => {
        res.json({ message: 'Successfully updated event' });
    }).catch((err) => {
        res.json(err);
    });
});

// Delete event by id
app.get('/delete/', (req, res) => {
    Events.sync({ force: false }).then(() => {
        return Events.destroy({
            where: {
                id: req.body.id
            }
        });
    }).then((events) => {
        res.json({ message: 'Successfully deleted event' });
    }).catch((err) => {
        res.json(err);
    });
});


app.listen(PORT, () => {
    console.log(`Server started on: ${HOST}:${PORT}`);
});