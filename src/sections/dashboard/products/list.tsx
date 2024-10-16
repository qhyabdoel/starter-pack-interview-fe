import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {
  Grid,
  Paper,
  Table,
  Button,
  Dialog,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  DialogTitle,
  TableContainer,
} from '@mui/material';

import axios, { endpoints } from 'src/utils/axios';

import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

type Props = {
  title?: string;
};

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
};

export function ProductListView({ title = 'List' }: Props) {
  const [rows, setRows] = useState<Array<Product>>([]);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [valueNama, setValueName] = useState('');
  const [valueDescription, setValueDescripton] = useState('');
  const [valuePrice, setValuePrice] = useState(0);
  const [valId, setValId] = useState(0);
  const formAddTitle = 'Add Product';
  const formUpdateTitle = 'Update Product';
  const [formTitle, setFormTitle] = useState(formAddTitle);

  const getProducsFromAPI = async () => {
    const productApiRes = await axios.get(endpoints.products);
    setRows(productApiRes?.data || []);
  };

  const handleSubmitForm = async () => {
    console.log({ valId });
    if (valId) await puttProductToAPI();
    else await postProductToAPI();
    await getProducsFromAPI();
    setOpenFormModal(false);
  };

  const handleSubmitDelete = async () => {
    const productApiRes = await axios.delete(`${endpoints.products}/${valId}`);
    console.log({ productApiRes });
    await getProducsFromAPI();
    setOpenDeleteModal(false);
  };

  const handleOpenDeleteModal = (id: number) => {
    setValId(id);
    setOpenDeleteModal(true);
  };

  const postProductToAPI = async () => {
    const productApiRes = await axios.post(endpoints.products, {
      name: valueNama,
      description: valueDescription,
      price: valuePrice,
    });

    console.log({ productApiRes });
  };

  const puttProductToAPI = async () => {
    const productApiRes = await axios.put(`${endpoints.products}/${valId}`, {
      name: valueNama,
      description: valueDescription,
      price: valuePrice,
    });

    console.log({ productApiRes });
  };

  useEffect(() => {
    getProducsFromAPI();
  }, []);

  const handleOpenFormModal = (paramTitle: string, data?: Product) => {
    setFormTitle(paramTitle);
    setOpenFormModal(true);
    setValueName(data?.name || '');
    setValueDescripton(data?.description || '');
    setValuePrice(data?.price || 0);
    setValId(data?.id || 0);
  };

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4"> {title} </Typography>

      <Box sx={{ mt: 2 }}>
        <Button variant="soft" color="primary" onClick={() => handleOpenFormModal(formAddTitle)}>
          Add Product
        </Button>
      </Box>

      <Box
        sx={{
          mt: 2,
          width: 1,
          height: 320,
          borderRadius: 2,
          bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.04),
          border: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
        }}
      >
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {row.id}
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>{row.price}</TableCell>
                  <TableCell>
                    <Button
                      color="info"
                      variant="contained"
                      size="small"
                      onClick={() => handleOpenFormModal(formUpdateTitle, row)}
                    >
                      Update
                    </Button>
                    <Button
                      color="error"
                      variant="contained"
                      size="small"
                      sx={{ ml: 1 }}
                      onClick={() => handleOpenDeleteModal(row.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog
        open={openFormModal}
        fullWidth
        onClose={() => setOpenFormModal(false)}
        sx={{ mb: 28 }}
      >
        <DialogTitle>{formTitle}</DialogTitle>
        <Box sx={{ px: 3, pb: 3 }}>
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ mb: 1 }}>Name</Typography>
            <TextField
              placeholder="Title"
              value={valueNama}
              fullWidth
              onChange={(e: any) => setValueName(e.target.value)}
            />
          </Box>
          <Grid sx={{ mb: 2 }}>
            <Typography sx={{ mb: 1 }}>Description</Typography>
            <TextField
              placeholder="Description"
              value={valueDescription}
              fullWidth
              onChange={(e: any) => setValueDescripton(e.target.value)}
            />
          </Grid>
          <Grid sx={{ mb: 2 }}>
            <Typography sx={{ mb: 1 }}>Price</Typography>
            <TextField
              placeholder="Status"
              value={valuePrice}
              fullWidth
              onChange={(e: any) => setValuePrice(Number(e.target.value))}
              type="number"
            />
          </Grid>
          <Grid sx={{ mt: 4, textAlign: 'right' }}>
            <Button
              variant="contained"
              sx={{ fontSize: 16 }}
              size="medium"
              onClick={() => setOpenFormModal(false)}
            >
              Close
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ ml: 1, fontSize: 16 }}
              size="medium"
              onClick={handleSubmitForm}
            >
              Submit
            </Button>
          </Grid>
        </Box>
      </Dialog>

      <Dialog
        open={openDeleteModal}
        fullWidth
        onClose={() => setOpenDeleteModal(false)}
        sx={{ mb: 28 }}
      >
        <DialogTitle>Delete Product</DialogTitle>
        <Box sx={{ px: 3, pb: 3 }}>
          <Typography>Are you sure to delete this product?</Typography>
          <Grid sx={{ mt: 4, textAlign: 'right' }}>
            <Button
              variant="contained"
              sx={{ fontSize: 16 }}
              size="medium"
              onClick={() => setOpenDeleteModal(false)}
            >
              Close
            </Button>
            <Button
              variant="contained"
              color="error"
              sx={{ ml: 1, fontSize: 16 }}
              size="medium"
              onClick={handleSubmitDelete}
            >
              Delete
            </Button>
          </Grid>
        </Box>
      </Dialog>
    </DashboardContent>
  );
}
