/** Implementation to scroll up always when go back or go to a new page */
/** Used in "index.tsx" */
import {withRouter} from 'react-router-dom'
import {useEffect} from 'react'

const ScrollToTop = ({children, match, location: {pathname}} : any) => {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])

    return children
};

export default withRouter(ScrollToTop);

/** More implementation docs: https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/docs/guides/scroll-restoration.md */