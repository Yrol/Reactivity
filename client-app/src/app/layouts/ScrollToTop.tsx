/** Implementation to scroll up always when go back or go to a new page */
/** Used in "index.tsx" */
import {withRouter, RouteComponentProps} from 'react-router-dom'
import {useEffect} from 'react'

const ScrollToTop: React.FC<RouteComponentProps> = ({children, match, history, location: {pathname}} : any) => {
    useEffect(() => {
        //PUSH - if the component is re-rendered only. Hence, back button and forward will retain the previous scroll positions since they're "POP"
        if (history.action === 'PUSH'){
            window.scrollTo(0, 0)
        }
    }, [pathname, history])

    return children
};

export default withRouter(ScrollToTop);

/** More implementation docs: https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/docs/guides/scroll-restoration.md */