import { Scrollbars } from 'react-custom-scrollbars';
const ScrollbarNormal = ({autoHide = true, autoHideTimeout = 2000, autoHideDuration = 500, autoHeight = true, autoHeightMin = "100%", ...parameters }) => {
    return (
        <Scrollbars
        autoHide={autoHide}
        autoHideTimeout={autoHideTimeout}
        autoHideDuration={autoHideDuration}
        autoHeight={autoHeight}
        style={{ height: "100%" }} autoHeightMin={autoHeightMin}
        {...parameters}
        >
        </Scrollbars>
    );
}

export default ScrollbarNormal;