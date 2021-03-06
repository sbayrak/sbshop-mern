import React, { useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import axios from 'axios';
import { listProductDetails, updateProduct } from '../actions/productActions';
import {
  Container,
  Grid,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  Typography,
} from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {
  makeStyles,
  createMuiTheme,
  ThemeProvider,
} from '@material-ui/core/styles';
import { PRODUCT_UPDATE_RESET } from '../constants/productContants';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#212121',
    },
  },
});

const useStyles = makeStyles((theme) => ({
  rootContainer: {
    minHeight: '100vh',
  },
  gridContainer: {
    width: '45%',
    margin: '0 auto',
    marginTop: 100,
    padding: 10,
    [theme.breakpoints.down('sm')]: {
      width: '90%',
    },
  },
  gridItem: {
    paddingBottom: 20,
  },

  lockBtn: {
    backgroundColor: '#212121',
    color: '#f9c11c',
    transition: '0.5s ease',
    '&:hover': {
      backgroundColor: '#212121',
      transform: 'scale(1.1)',
    },
  },
  SignInBtn: {
    backgroundColor: '#212121',
    color: '#f9c11c',
    '&:hover': {
      backgroundColor: '#212121',
    },
  },
  Typo1: {
    marginTop: 20,
    color: theme.palette.grey[700],
  },
  Typo1Link: {
    textDecoration: 'none',
    color: '#212121',
    borderBottom: '2px solid #f9c11c',
  },
  input: {
    display: 'none',
  },
}));

const ProductEditScreen = ({ match, history }) => {
  const productId = match.params.id;
  const classes = useStyles();
  const [name, setName] = useState(null);
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      history.push('/admin/productlist');
    } else {
      if (!product.name || product._id !== productId) {
        dispatch(listProductDetails(productId));
      } else {
        setName(product.name);
        setPrice(product.price);
        setImage(product.image);
        setBrand(product.brand);
        setCategory(product.category);
        setCountInStock(product.countInStock);
        setDescription(product.description);
      }
    }
  }, [dispatch, history, product, productId, successUpdate]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      const { data } = await axios.post('/api/uploads/', formData, config);

      setImage(data);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateProduct({
        _id: productId,
        name,
        price,
        image,
        brand,
        category,
        description,
        countInStock,
      })
    );
  };

  return (
    <Fragment>
      <ThemeProvider theme={theme}>
        <Container maxWidth='lg' className={classes.rootContainer}>
          <form onSubmit={submitHandler}>
            <Grid container className={classes.gridContainer}>
              <Grid
                item
                xs={12}
                className={classes.gridItem}
                style={{ textAlign: 'center' }}
              >
                <IconButton className={classes.lockBtn}>
                  <ExitToAppIcon></ExitToAppIcon>
                </IconButton>

                {error && (
                  <Message
                    open={true}
                    variant='error'
                    message={error}
                  ></Message>
                )}
                {loadingUpdate && <CircularProgress></CircularProgress>}
                {errorUpdate && (
                  <Message variant='error' message={errorUpdate}></Message>
                )}
              </Grid>

              {loading ? (
                <CircularProgress></CircularProgress>
              ) : (
                <Fragment>
                  <Grid item xs={12} className={classes.gridItem}>
                    <TextField
                      error={Boolean(error)}
                      label='Name'
                      // helperText='error message'
                      variant='outlined'
                      fullWidth
                      color='primary'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} className={classes.gridItem}>
                    <TextField
                      error={Boolean(error)}
                      label='price'
                      // helperText='error message'
                      variant='outlined'
                      fullWidth
                      color='primary'
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} className={classes.gridItem}>
                    <Typography variant='body1' gutterBottom>
                      Image
                    </Typography>
                    <input
                      accept='image/*'
                      className={classes.input}
                      id='contained-button-file'
                      multiple
                      type='file'
                      onChange={uploadFileHandler}
                    />
                    <label htmlFor='contained-button-file'>
                      <Button
                        variant='contained'
                        color='primary'
                        component='span'
                      >
                        Upload
                      </Button>
                    </label>
                    {uploading && <CircularProgress></CircularProgress>}
                  </Grid>
                  <Grid item xs={12} className={classes.gridItem}>
                    <TextField
                      error={Boolean(error)}
                      label='Brand'
                      // helperText='error message'
                      variant='outlined'
                      fullWidth
                      color='primary'
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} className={classes.gridItem}>
                    <TextField
                      error={Boolean(error)}
                      label='category'
                      // helperText='error message'
                      variant='outlined'
                      fullWidth
                      color='primary'
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} className={classes.gridItem}>
                    <TextField
                      error={Boolean(error)}
                      label='countInStock'
                      // helperText='error message'
                      variant='outlined'
                      fullWidth
                      color='primary'
                      value={countInStock}
                      onChange={(e) => setCountInStock(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} className={classes.gridItem}>
                    <TextField
                      error={Boolean(error)}
                      label='description'
                      // helperText='error message'
                      variant='outlined'
                      fullWidth
                      color='primary'
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} className={classes.gridItem}>
                    <Button
                      variant='contained'
                      className={classes.SignInBtn}
                      fullWidth
                      type='submit'
                    >
                      Update
                    </Button>
                  </Grid>
                </Fragment>
              )}
            </Grid>
          </form>
        </Container>
      </ThemeProvider>
    </Fragment>
  );
};

export default ProductEditScreen;
