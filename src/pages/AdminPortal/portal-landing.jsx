import React from 'react';
import { Button } from 'react-bootstrap';
import { CustomiizableModal } from '@components';

const PortalLanding = () => {
    const sampleFunc = () => {
        alert('sample function lololololoasdasdasdasdsadjaddasjda');
    };
    return (
        <CustomiizableModal
            modalOpenBtn="TEST OPEN CLICK ME BROTHER"
            heading="this is a test"
            btn1Text="close this pls"
            btn2Text="submit this pls"
            btn2Func={sampleFunc}
            body={
                <div>
                    <h1>AHAHAHAHA CUSTOM BODY FOR MODAL</h1>
                    <Button
                        onClick={() => {
                            window.location.replace(
                                'https://www.google.com/search?q=father+of+compute+rscience&oq=father+of+compute+rscience&aqs=chrome..69i57j46i13i512j0i10i13i512l2j0i10i13i15i30i625j0i10i13i30j0i5i10i13i30j0i5i10i13i30i625j0i5i13i30.2925j1j7&sourceid=chrome&ie=UTF-8'
                            );
                        }}
                    >
                        YO CLICK THIS TRUS
                    </Button>
                </div>
            }
        />
    );
};
export default PortalLanding;
