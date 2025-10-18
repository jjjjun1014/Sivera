"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useState } from "react";
import { toast } from "@/utils/toast";

interface SaveConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}

export function SaveConfigModal({
  isOpen,
  onClose,
  onSave,
}: SaveConfigModalProps) {
  const [configName, setConfigName] = useState("");

  const handleSave = () => {
    if (!configName.trim()) {
      toast.error({
        title: "이름 입력 필요",
        description: "설정 이름을 입력해주세요.",
      });
      return;
    }

    onSave(configName.trim());
    setConfigName("");
    onClose();
  };

  const handleClose = () => {
    setConfigName("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="sm">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <h3 className="text-xl font-semibold">현재 설정 저장</h3>
            </ModalHeader>
            <ModalBody>
              <Input
                label="설정 이름"
                placeholder="예: 기본 보기, 성과 중심 보기"
                value={configName}
                onChange={(e) => setConfigName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSave();
                  }
                }}
                autoFocus
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={handleClose}>
                취소
              </Button>
              <Button color="primary" onPress={handleSave}>
                저장
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
