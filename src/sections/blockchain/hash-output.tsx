import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

const HashOutput = ({
  hash,
  status,
  title,
}: {
  hash: string;
  status?: boolean;
  title?: string;
}) => {
  const backgroundColor =
    status === undefined ? "#f5f5f5" : status ? "green" : "red";

  return (
    <Stack>
      {title ? (
        <Typography variant="body2" component="h3">
          {title}
        </Typography>
      ) : (
        <Typography variant="h6" component="h3">
          Hash Output (SHA-256):
        </Typography>
      )}

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
        {hash || "Your hash will appear here..."}
      </Typography>
    </Stack>
  );
};

export default HashOutput;
