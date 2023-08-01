import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import pass from "../../../Assets/pass.jpg";
import { alpha, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typed from "react-typed";

const Hero = () => {
  const theme = useTheme();

  const isMd = useMediaQuery(theme.breakpoints.up("md"), {
    defaultMatches: true,
  });
  return (
    <Grid container spacing={4}>
      <Grid item container xs={12} md={6} alignItems={"center"}>
        <Box
          data-aos={isMd ? "fade-right" : "fade-up"}
          paddingLeft={isMd && 2}
          p={1}
        >
          <Box marginBottom={2}>
            <Typography
              variant="h4"
              color="text.primary"
              sx={{ fontWeight: 700 }}
            >
              Scan Pass <br />
              Votre solution{" "}
              <Typography
                color={"primary"}
                component={"span"}
                variant={"inherit"}
                sx={{
                  background: `linear-gradient(180deg, transparent 82%, ${alpha(
                    theme.palette.secondary.main,
                    0.3
                  )} 0%)`,
                }}
              >
                <Typed
                  strings={["Rapide ", "et", "efficace"]}
                  typeSpeed={100}
                  loop={true}
                />
              </Typography>
            </Typography>
          </Box>
          <Box marginBottom={3}>
            <Typography variant="h6" component="p" color="text.secondary">
              Fini les retards et les files d'attente à l'entrée, ScanPass est
              un système rapide, sûr et fiable qui permet de contrôler l'accès
              des employés de manière efficace. Avec ScanPass, vous pouvez vous
              concentrer sur l'essentiel : la croissance de votre entreprise.
            </Typography>
          </Box>
          <Box
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "stretched", sm: "flex-start" }}
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth={isMd ? false : true}
              href="#contact"
              sx={{ ":hover": { background: "#7355F7", color: "white" } }}
            >
              Prendre rendez-vous
            </Button>
            {/* <Box
              component={Button}
              variant="outlined"
              color="primary"
              size="large"
              marginTop={{ xs: 2, sm: 0 }}
              marginLeft={{ sm: 2 }}
              fullWidth={isMd ? false : true}
            >
              Learn more
            </Box> */}
          </Box>
        </Box>
      </Grid>
      <Grid
        item
        container
        alignItems={"center"}
        justifyContent={"center"}
        xs={12}
        md={6}
        data-aos="flip-left"
        data-aos-easing="ease-out-cubic"
        data-aos-duration="2000"
      >
        <Box
          component={LazyLoadImage}
          height={1}
          width={1}
          src={pass}
          alt="..."
          effect="blur"
          boxShadow={3}
          borderRadius={2}
          maxWidth={600}
          sx={{
            filter: theme.palette.mode === "dark" ? "brightness(0.7)" : "none",
          }}
        />
      </Grid>
    </Grid>
  );
};

export default Hero;
