import React, { useEffect, useState } from "react";
import Modal from "react-modal";

const PrivacyPolicy = ({ isOpen, onRequestClose }) => {
  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    fetch("/privacy-policy.html")
      .then((response) => response.text())
      .then((data) => setHtmlContent(data));
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Privacy Policy"
    >
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      <button onClick={onRequestClose}>Close</button>
    </Modal>
  );
};

export default PrivacyPolicy;
