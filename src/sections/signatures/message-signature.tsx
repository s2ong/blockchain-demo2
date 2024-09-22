import Typography from "@mui/material/Typography";

const MessageSignature = ({
  hash,
  status,
}: {
  hash: string;
  status?: boolean;
}) => {
  const backgroundColor =
    status === undefined ? "#f5f5f5" : status ? "green" : "red";

  return (
    <Typography
      variant="body2"
      sx={{
        wordWrap: "break-word",
        backgroundColor,
        padding: "10px",
        borderRadius: "5px",
        marginTop: "10px",
      }}
    >
      {hash || "Message Signature"}
    </Typography>
  );
};

export default MessageSignature;
