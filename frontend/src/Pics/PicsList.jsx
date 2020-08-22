import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Fab from '@material-ui/core/Fab';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';

const useStyles = makeStyles(() => ({
  root: {
    maxWidth: '100%',
    flexGrow: 1,
  },
  media: {
    height: 0,
    paddingTop: '50%',
  },
  fav: {
    color: 'red',
  },
}));

export default function PicsList({
  pics,
  likePic,
}) {
  const classes = useStyles();

  return (
    <Grid container spacing={3} className={classes.root}>
    {pics.map((pic, i) =>
      <Grid item xs={6} key={i}>
        <Paper>
          <CardMedia
            className={classes.media}
            image={pic}
          >
          </CardMedia>
          <Fab
            onClick={() => { likePic(pic) }}
            color="secondary"
          >
            <FavoriteIcon />
          </Fab>
        </Paper>
      </Grid>
    )}
    </Grid>
  )
}
