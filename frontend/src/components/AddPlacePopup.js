import React from "react";

import PopupWithForm from "./PopupWithForm";

function AddPlacePopup(props) {
  const [imageTitle, setImageTitle] = React.useState("");
  const [imageLink, setImageLink] = React.useState("");

  function handleSubmit(e) {
    e.preventDefault();

    props.onAddPlaceSubmit({
      name: imageTitle,
      link: imageLink,
    });
  }

  function handleImageTitleChange(e) {
    setImageTitle(e.target.value);
  }

  function handleImageLinkChange(e) {
    setImageLink(e.target.value);
  }

  React.useEffect(() => {
    setImageTitle("");
    setImageLink("");
  }, [props.isOpen]);

  return (
    <PopupWithForm
      name={"add-card"}
      title={"New place"}
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      buttonText={"Create"}
    >
      <input
        type="text"
        className="form__input form__input_type_title popup__input"
        placeholder="Title"
        name="title"
        id="title-input"
        minLength="1"
        maxLength="30"
        value={imageTitle}
        onChange={handleImageTitleChange}
        required
      />
      <span className="popup__error" id="title-input-error"></span>
      <input
        type="url"
        className="form__input form__input_type_link popup__input"
        placeholder="Image link"
        name="link"
        id="image-link-input"
        value={imageLink}
        onChange={handleImageLinkChange}
        required
      />
      <span className="popup__error" id="image-link-input-error"></span>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
