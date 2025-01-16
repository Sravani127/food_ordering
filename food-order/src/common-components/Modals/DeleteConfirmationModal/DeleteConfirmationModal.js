import { Modal, Typography, Button, Box } from "@mui/material";
import React, { useContext } from "react";
import { FoodsContext } from "../../../components/layout/layout";
import { deleteRequest } from "../../../services/apiService";

const DeleteConfirmationModal = ({
  setShowConfirmationModal,
  selectedItemId,
  showConfirmationModal
}) => {
  const { refetchFoods } = useContext(FoodsContext);
  const confirmDelete = () => {
    deleteRequest(`/foods/${selectedItemId}`).then((res) => {
      if (res?.data) {
        refetchFoods();
        setShowConfirmationModal(false);
      }
    });
  };
  return (
    <Modal
      open={showConfirmationModal}
      onClose={() => setShowConfirmationModal(false)}
      aria-labelledby="confirmation-modal-title"
      aria-describedby="confirmation-modal-description"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          boxShadow: 24,
          p: 4,
          borderRadius: "8px",
        }}
      >
        <Typography id="confirmation-modal-title" variant="h6" gutterBottom>
          Confirm Deletion
        </Typography>
        <Typography
          id="confirmation-modal-description"
          variant="body1"
          gutterBottom
        >
          Are you sure you want to delete this item?
        </Typography>
        <Button
          onClick={confirmDelete}
          variant="contained"
          color="primary"
          sx={{ mr: 2 }}
        >
          Yes
        </Button>
        <Button
          onClick={() => setShowConfirmationModal(false)}
          variant="contained"
          color="secondary"
        >
          No
        </Button>
      </Box>
    </Modal>
  );
};

export default DeleteConfirmationModal;
