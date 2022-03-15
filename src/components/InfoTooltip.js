import successIcon from "../images/icon/success.svg";
import failIcon from "../images/icon/fail.svg";

function InfoTooltip(props) {

  console.log(props);
  let success = false;
  if(props.success === true){
    success = true;
  }

  return (
    <div
      className={`popup popup_type_info-tooltip ${
        props.isOpen && "popup_is-open"
      }`}
    >
      <div className="popup__content">
        <button
          type="button"
          className="popup__close"
          onClick={props.onClose}
        ></button>
        {success ? (
          <>
            <img
              className="tooltip__image"
              src={successIcon}
              alt={"Success"}
            />
            <p className="tooltip__message">Success! You have now been registered.</p>
          </>
        ) : (
          <>
            <img
              className="tooltip__image"
              src={failIcon}
              alt={"Fail"}
            />
            <p className="tooltip__message">Oops, something went wrong! Please try again.</p>
          </> 
        )}
        
      </div>
    </div>
  );
}

export default InfoTooltip;
