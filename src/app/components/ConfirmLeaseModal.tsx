import React from "react";
import Modal, { ModalHeader, ModalBody, ModalFooter } from "./Modal";
import { Button } from "@/components/ui/button";

interface ConfirmLeaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmLeaseModal: React.FC<ConfirmLeaseModalProps> = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>Confirm Lease</ModalHeader>
      <ModalBody>
        <p>
          Are you sure you want to lease this domain? Please complete the payment as soon as possible to secure
          the domain.
        </p>
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="secondary" onClick={onConfirm}>
          Proceed
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmLeaseModal;
