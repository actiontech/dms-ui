import { useState, useMemo } from 'react';

const useAssignmentForm = () => {
  const [assignData, setAssignData] = useState([]);
  const [assignLoading, setAssignLoading] = useState(false);

  const getAssignData = () => {
    setAssignLoading(true);
    setAssignData([]);
    setAssignLoading(false);
  };

  const getAssignmentOptions = useMemo(() => {
    return assignData.map((item) => {
      return {
        lable: '',
        value: ''
      };
    });
  }, [assignData]);

  return {
    assignData,
    assignLoading,
    getAssignData,
    getAssignmentOptions
  };
};

export default useAssignmentForm;
