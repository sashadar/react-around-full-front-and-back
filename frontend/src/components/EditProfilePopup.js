import React from "react";

import PopupWithForm from "./PopupWithForm";

import CurrentUserContext from "../contexts/CurrentUserContext";

function EditProfilePopup(props) {
  const [name, setName] = React.useState(" ");
  const [description, setDescription] = React.useState(" ");

  const currentUser = React.useContext(CurrentUserContext);

  React.useEffect(() => {
    setName(currentUser.name + "");
    setDescription(currentUser.about + "");
  }, [currentUser, props.isOpen]);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleDescriptionCHange(e) {
    setDescription(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();

    props.onUpdateUser({
      name: name,
      about: description,
    });
  }

  return (
    <PopupWithForm
      name={"edit-profile"}
      title={"Edit Profile"}
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      buttonText={"Save"}
    >
      <input
        type="text"
        className="form__input form__input_type_name popup__input"
        name="name"
        id="name-input"
        minLength="2"
        maxLength="40"
        value={name}
        onChange={handleNameChange}
        required
      />

      <span className="popup__error" id="name-input-error"></span>
      <input
        type="text"
        className="form__input form__input_type_job popup__input"
        name="job"
        id="job-input"
        minLength="2"
        maxLength="200"
        value={description}
        onChange={handleDescriptionCHange}
        required
      />
      <span className="popup__error" id="job-input-error"></span>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
