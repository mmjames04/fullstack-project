import React, { useState, createRef, useEffect } from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Alert from '@material-ui/lab/Alert';

import PicsList from './PicsList';

const useStyles = makeStyles((theme) => ({
  appbar: {
    backgroundColor: '#4FA275',
    padding: theme.spacing(0,2),
    height: 50,
    top: 'auto',
    bottom: 0,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& > button': {
      margin: theme.spacing(0,1),
      minWidth: theme.spacing(12),
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const api_url = 'http://localhost:3010/api/v1/favorites';

export default function Pics() {
  const classes = useStyles();
  const [hasError, setErrors] = useState(false);
  const inputRef = createRef();
  const [favorites, setFavorites] = useState([]);
  const [pics, setPics] = useState([]);
  const [type, setType] = useState();

  useEffect(() => {
    inputRef.current.focus();
  });

  useEffect(() => {
      fetchFavorites();
      fetchDogs();
  }, []);

  function fetchFavorites() {
    fetch(api_url)
      .then(res => res.json())
      .then(res => {
        let dogs = [];
        res.map(dog => 
          setFavorites(dogs.concat(dog.url))
        )
      })
      .catch(() => setErrors(true))
  }

  function fetchDogs() {
    fetch('https://dog.ceo/api/breeds/image/random/10')
      .then(res => res.json())
      .then(res => setPics(res.message))
      .catch(() => setErrors(true))
  }

  function getRandomPics() {
    setType('random');
    fetchDogs();
  }

  function getFavPics() {
    setType('favorite');
  }

  function getPics() {
    if (inputRef.current) {
      fetch(`https://dog.ceo/api/breed/${inputRef.current.value}/images`)
        .then(res => res.json())
        .then(res => {
          console.log(res)
          res.status === 'success' ? setPics(res.message) : setErrors(res.message);
        })
        .catch(() => setErrors(true))
    }
  }

  async function likePic(pic) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accepts', 'application/json');
    const body = {
      favorite: {
        url: pic
      }
    }
    await fetch(api_url, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    }).then(res => res.json())
      .then(res => {
        fetchFavorites();
        setType('favorite')
      })
      .catch(() => setErrors(true))
  }

  return (
    <>
      <AppBar
        position="sticky"
        className={classes.appbar}
      >
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6">
            Find a Dog!
          </Typography>

          <div className={classes.search}>
            <Tooltip title="Search">
              <IconButton
                type="submit"
                color="primary"
                onClick={getPics}
                aria-label="Search"
              >
                <SearchIcon />
              </IconButton>
            </Tooltip>

            <InputBase
              inputRef={inputRef}
              placeholder="Search..."
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>

          <Button
            variant="contained"
            onClick={getRandomPics}
          >
            <Typography>
              Random Dog
            </Typography>
          </Button>
          <Button
            variant="contained"
            onClick={getFavPics}
          >
            <Typography>
              Show Fav Dogs
            </Typography>
          </Button>
        </Toolbar>
      </AppBar>
      {hasError !== false ? <Alert severity="error">{hasError}</Alert> : null}
      <PicsList
        pics={type === 'favorite' ? favorites : pics}
        likePic={likePic}
      />
    </>
  );
}
