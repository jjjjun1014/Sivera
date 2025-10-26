"use client";

import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  platformName?: string;
  campaignType?: string;
}

export function CreateCampaignModal({
  isOpen,
  onClose,
  platformName = "플랫폼",
  campaignType = "",
}: CreateCampaignModalProps) {
  const [campaignName, setCampaignName] = useState("");
  const [budget, setBudget] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    if (!campaignName.trim()) {
      return;
    }

    setIsLoading(true);
    
    // TODO: API 호출로 캠페인 생성
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    handleClose();
  };

  const handleClose = () => {
    setCampaignName("");
    setBudget("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-bold">새 캠페인 만들기</h2>
          <p className="text-sm text-default-500">
            {platformName} {campaignType && `- ${campaignType}`}
          </p>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-4">
            <Input
              label="캠페인 이름"
              placeholder="캠페인 이름을 입력하세요"
              value={campaignName}
              onValueChange={setCampaignName}
              variant="bordered"
              radius="sm"
              isRequired
            />
            <Input
              label="일일 예산"
              placeholder="0"
              value={budget}
              onValueChange={setBudget}
              variant="bordered"
              radius="sm"
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">₩</span>
                </div>
              }
              type="number"
            />
            <div className="bg-default-100 p-4 rounded-lg">
              <p className="text-xs text-default-600">
                💡 캠페인 생성 후 {platformName} 플랫폼에서 추가 설정을 진행할 수 있습니다.
              </p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={handleClose} radius="sm">
            취소
          </Button>
          <Button
            color="primary"
            onPress={handleCreate}
            radius="sm"
            isDisabled={!campaignName.trim()}
            isLoading={isLoading}
          >
            생성
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
