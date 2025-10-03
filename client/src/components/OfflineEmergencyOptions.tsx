
import React from "react";
import SmsFallbackInfo from "./SmsFallbackInfo";
import { initNetworkListener } from "@/utils/offlineStorage";
import { useEffect } from "react";

const OfflineEmergencyOptions = () => {
  useEffect(() => {
    // Initialize network listener to sync offline requests when back online
    initNetworkListener();
  }, []);

  return (
    <div className="mt-6">
      <SmsFallbackInfo />
    </div>
  );
};

export default OfflineEmergencyOptions;