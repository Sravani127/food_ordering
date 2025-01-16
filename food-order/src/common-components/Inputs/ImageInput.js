import { Add, Edit } from "@mui/icons-material";
import { IconButton } from "@mui/material";

export const ImageInput = ({ field, setFieldValue, imagePreview }) => {
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFieldValue(field.name, reader.result);
        };
        reader.readAsDataURL(file);
      }
    };
  
    return (
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="icon-button-file"
          type="file"
          onChange={handleImageChange}
        />
        <label htmlFor="icon-button-file">
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="span"
            style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
          >
            {imagePreview ? (
              <Edit fontSize="large" />
            ) : (
              <Add fontSize="large" />
            )}
          </IconButton>
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Food"
              style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                backgroundColor: 'lightgray',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Add fontSize="large" />
            </div>
          )}
        </label>
      </div>
    );
  };