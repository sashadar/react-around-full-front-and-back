import React from "react";

import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup(props) {
  const avatarLinkInput = React.useRef("");

  function handleSubmit(e) {
    e.preventDefault();

    props.onUpdateAvatar({
      avatarLink: avatarLinkInput.current.value,
    });
  }

  React.useEffect(() => {
    avatarLinkInput.current.value = "";
  }, [props.isOpen]);

  return (
    <PopupWithForm
      name={"edit-avatar"}
      title={"Change profile picture"}
      onSubmit={handleSubmit}
      onClose={props.onClose}
      isOpen={props.isOpen}
      buttonText={"Save"}
    >
      <input
        type="url"
        className="form__input form__input_type_link popup__input"
        placeholder="Image link"
        name="link"
        id="avatar-link-input"
        ref={avatarLinkInput}
        required
      />
      <span className="popup__error" id="avatar-link-input-error"></span>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
