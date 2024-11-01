export type SubmitWorkflowButtonProps = {
  isConfirmationRequiredForSubmission: boolean;
  loading: boolean;
  submitWorkflowConfirmationMessage?: string;
  onClick: () => void;
};
