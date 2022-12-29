import { Global } from "@mantine/core";

const montserratUrl = "/fonts/Montserrat.ttf";
const openSansUrl = "/fonts/OpenSans.ttf";

const CustomFonts = () => {
    return (
        <Global styles={[
            {
                '@font-face': {
                    fontFamily: 'Montserrat',
                    src: `url('${montserratUrl}') format('truetype')`,
                    fontStyle: 'normal',
                    fontWeight: '200 700',
                },
            },
            {
                '@font-face': {
                    fontFamily: 'Open Sans',
                    src: `url('${openSansUrl}') format('truetype')`,
                    fontStyle: 'normal',
                    fontWeight: '200 700',
                },
            }
        ]}/>
    )
}

export default CustomFonts;
