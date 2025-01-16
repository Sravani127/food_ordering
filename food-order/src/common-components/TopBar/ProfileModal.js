import { useState } from 'react';
import { Modal, Box, Typography, Avatar, Button, TextField } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const ProfileModal = ({ showProfileDetailsModal, handleCloseProfileDetailsModal, userDetails, updateUser }) => {
  const [editMode, setEditMode] = useState(false);
  const [newAvatar, setNewAvatar] = useState(null);

  const handleEditClick = () => {
    setEditMode(!editMode);
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setNewAvatar(reader.result);
      };
    }
  };

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    mobile_number: Yup.string().required('Mobile number is required'),
  });

  return (
    <Modal
      open={showProfileDetailsModal}
      onClose={handleCloseProfileDetailsModal}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "500px",
          textAlign: "center",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: "8px",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Profile Details
        </Typography>
        <Avatar
          alt="Profile"
          src={editMode ? newAvatar || userDetails?.profileImage : userDetails?.profileImage}
          sx={{ width: 100, height: 100, mx: "auto", mb: 2 }}
        />
        {editMode ? (
          <Formik
            initialValues={{
              first_name: userDetails?.first_name,
              last_name: userDetails?.last_name,
              email: userDetails?.email,
              mobile_number: userDetails?.mobile_number,
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              updateUser({...userDetails, ...values, profileImage: newAvatar || userDetails?.profileImage})
              setEditMode(false);
              handleCloseProfileDetailsModal()
            }}
          >
            {({ errors, touched }) => (
              <Form>
                <Box mb={2}>
                  <Field name="first_name" as={TextField} label="First Name" fullWidth error={errors.first_name && touched.first_name} helperText={errors.first_name && touched.first_name ? errors.first_name : null} />
                </Box>
                <Box mb={2}>
                  <Field name="last_name" as={TextField} label="Last Name" fullWidth error={errors.last_name && touched.last_name} helperText={errors.last_name && touched.last_name ? errors.last_name : null} />
                </Box>
                <Box mb={2}>
                  <Field name="email" as={TextField} label="Email" fullWidth error={errors.email && touched.email} helperText={errors.email && touched.email ? errors.email : null} />
                </Box>
                <Box mb={2}>
                  <Field name="mobile_number" as={TextField} label="Mobile Number" fullWidth error={errors.mobile_number && touched.mobile_number} helperText={errors.mobile_number && touched.mobile_number ? errors.mobile_number : null} />
                </Box>
                <Box mb={2}>
                  <Box textAlign={'start'} mb={1}>
                    <Typography variant="body1">Avatar</Typography>
                  </Box>
                  <input type="file" accept="image/*" onChange={handleAvatarChange} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button type="button" variant="contained" onClick={handleEditClick} color="error">
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" color="success">
                    Save
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        ) : (
          <>
            <Typography>{`${userDetails?.first_name} ${userDetails?.last_name}`}</Typography>
            <Typography>{userDetails?.email}</Typography>
            <Typography>{userDetails?.mobile_number}</Typography>
            <Typography>Referral Id : {userDetails?._id}</Typography>
            <Button onClick={handleEditClick} variant="contained" color="primary">
              Edit
            </Button>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default ProfileModal;
