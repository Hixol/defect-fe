import { useState, useRef } from 'react';
import Link from 'next/link';
import { Container, Row, Col } from 'react-bootstrap';
import { LayoutTwo } from '../../components/Layout';
import { BreadcrumbOne } from '../../components/Breadcrumb';
import { InputField } from '../../components/Form';
import Loader from '../../components/Loader';
import { Form, FormFile } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useToasts } from 'react-toast-notifications';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';
import withSingleAuth from '../../hoc/withSingleAuth';
import { conditionalExpression } from '@babel/types';

const Signup = () => {
  const [fields, setFields] = useState({
    username: '',
    password: '',
    reTypePassword: '',
    email: '',
    firstName: '',
    lastName: '',
    nationality: '',
    mobile: '',
    phone: '',
    accountType: 'clinic',
    companyName: '',
    companyAddress: '',
    companyPostal: '',
    countryIncorporation: ''
  });
  const [errorMsg, setErrorMsg] = useState({
    password: '',
    reTypePassword: '',
    email: '',
    phone: '',
    mobile: '',
    postal: ''
  });

  const validImageFileFormat = ['png', 'jpg', 'jpeg'];
  const validAcraFileFormat = ['png', 'jpg', 'jpeg', 'pdf'];
  const [moh, setMOHLicence] = useState({});
  const [smc, setSMCCert] = useState({});
  const [acra, setAcra] = useState({});
  const [loading, setLoading] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const [selectionValue, setSelectionValue] = useState(null);
  const router = useRouter();
  const recaptchaRef = useRef(null);
  const { addToast } = useToasts();
  const formFields = [
    {
      id: 'username',
      name: 'username',
      field: 'Username ',
      value: fields.username,
      type: 'text',
      required: true,
      errorMsg: ''
    },
    {
      id: 'password',
      name: 'password',
      field: 'Password ',
      value: fields.password,
      type: 'password',
      required: true,
      errorMsg: errorMsg.password
    },
    {
      id: 'reTypePassword',
      name: 'reTypePassword',
      field: 'Re-Type Password ',
      value: fields.reTypePassword,
      type: 'password',
      required: true,
      errorMsg: errorMsg.reTypePassword
    },

    {
      id: 'email',
      name: 'email',
      field: 'Email Address ',
      type: 'email',
      value: fields.email,
      required: true,
      errorMsg: errorMsg.email
    },
    {
      id: 'firstName',
      name: 'firstName',
      field: 'First Name ',
      type: 'text',
      value: fields.firstName,
      required: true,
      errorMsg: ''
    },
    {
      id: 'lastName',
      name: 'lastName',
      field: 'Last Name ',
      type: 'text',
      value: fields.lastName,
      required: true,
      errorMsg: ''
    },
    {
      id: 'nationality',
      name: 'nationality',
      field: 'Nationality ',
      type: 'text',
      value: fields.nationality,
      required: true,
      errorMsg: ''
    },
    {
      id: 'mobile',
      name: 'mobile',
      field: 'Mobile ',
      type: 'tel',
      value: fields.mobile,
      required: false,
      errorMsg: errorMsg.mobile
    },
    {
      id: 'phone',
      name: 'phone',
      field: 'Phone',
      type: 'tel',
      value: fields.phone,
      required: true,
      errorMsg: errorMsg.phone
    },
    {
      id: 'companyName',
      name: 'companyName',
      field: 'Company Name ',
      value: fields.companyName,
      type: 'text',
      required: true,
      errorMsg: ''
    },
    {
      id: 'companyAddress',
      name: 'companyAddress',
      field: 'Company Address ',
      value: fields.companyAddress,
      type: 'text',
      required: true,
      errorMsg: ''
    },
    {
      id: 'companyPostal',
      name: 'companyPostal',
      field: 'Company Postal ',
      value: fields.companyPostal,
      type: 'text',
      required: true,
      errorMsg: errorMsg.postal
    },
    {
      id: 'countryIncorporation',
      name: 'countryIncorporation',
      field: 'Country of Incorporation ',
      type: 'text',
      value: fields.countryIncorporation,
      required: true,
      errorMsg: ''
    }
  ];
  const validPasswordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  const validEmailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const validNumberRegex = /^\d+$/;

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    if (name === 'password' && !validPasswordRegex.test(value)) {
      setErrorMsg({
        ...errorMsg,
        password:
          'Password must be minimum eight characters, at least one letter, one number and one special character'
      });
    } else if (name === 'password' && validPasswordRegex.test(value)) {
      setErrorMsg({ ...errorMsg, password: '' });
    } else if (name === 'reTypePassword' && value !== fields.password) {
      setErrorMsg({ ...errorMsg, reTypePassword: 'Passwords do not match' });
    } else if (name === 'reTypePassword' && value === fields.password) {
      setErrorMsg({ ...errorMsg, reTypePassword: '' });
    } else if (name === 'email' && !validEmailRegex.test(value)) {
      setErrorMsg({ ...errorMsg, email: 'Invalid email' });
    } else if (name === 'email' && validEmailRegex.test(value)) {
      setErrorMsg({ ...errorMsg, email: '' });
    } else if (name === 'phone' && !validNumberRegex.test(value)) {
      setErrorMsg({ ...errorMsg, phone: 'Phone must be numeric only' });
    } else if (name === 'phone' && validNumberRegex.test(value)) {
      setErrorMsg({ ...errorMsg, phone: '' });
    } else if (name === 'mobile' && !validNumberRegex.test(value)) {
      setErrorMsg({ ...errorMsg, mobile: 'Mobile must be numeric only' });
    } else if (name === 'mobile' && validNumberRegex.test(value)) {
      setErrorMsg({ ...errorMsg, mobile: '' });
    } else if (name === 'companyPostal' && !validNumberRegex.test(value)) {
      setErrorMsg({ ...errorMsg, postal: 'Postal code must be numeric only' });
    } else if (name === 'companyPostal' && validNumberRegex.test(value)) {
      setErrorMsg({ ...errorMsg, postal: '' });
    }

    if (name === 'accountType') {
      console.log('changehandle : ', value);
      if (value === 'clinic') {
        document.getElementById('smc-certification').disabled = false;
      } else {
        document.getElementById('smc-certification').disabled = true;
      }
    }
    setFields({ ...fields, [name]: value });
  };

  const captchaHandler = (e) => {
    console.log(e);
    setCaptchaValue(e);
  };

  const mohChangeHandler = (e) => {
    if (e.target.files.length > 0) {
      setMOHLicence(e.target.files[0]);
    }
  };
  const smcChangeHandler = (e) => {
    if (e.target.files.length > 0) {
      setSMCCert(e.target.files[0]);
    }
  };
  const acraChangeHandler = (e) => {
    if (e.target.files.length > 0) {
      setAcra(e.target.files[0]);
    }
  };

  /*var isSelected = false;  
  const setSelectionHandler = (e) => {
    const checked = e.target.checked;
    if (checked) {
      isSelected = true;  
      console.log("policy is checked : ", isSelected);  
    } else {
      isSelected = false;  
      console.log("policy is unchecked : ", isSelected);   
    }
  };*/
  const setSelectionHandler = (e) => {
    setSelectionValue(e.target.checked);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (!moh.name) {
      addToast('Please upload MOH / Wholesale Licence!', {
        appearance: 'error'
      });
      return;
    } else {
      var isValid = false;
      var filename = moh.name;
      var ext = filename.split('.').pop();

      for (const format in validImageFileFormat) {
        console.log('the format is : ', validImageFileFormat[format]);
        if (ext.toLowerCase() === validImageFileFormat[format]) {
          isValid = true;
          break;
        }
      }
      if (isValid == false) {
        addToast('Invalid MOH / Wholesale Licence file format!', {
          appearance: 'error'
        });
        return;
      }
    }
    if (!smc.name && fields.accountType == 'clinic') {
      addToast('Please upload SMC Certification!', { appearance: 'error' });
      return;
    } else if (smc.name && fields.accountType == 'clinic') {
      var isValid = false;
      var filename = smc.name;
      var ext = filename.split('.').pop();

      for (const format in validImageFileFormat) {
        console.log('the format is : ', validImageFileFormat[format]);
        if (ext.toLowerCase() === validImageFileFormat[format]) {
          isValid = true;
          break;
        }
      }
      if (isValid == false) {
        addToast('Invalid SMC Certification file format!', {
          appearance: 'error'
        });
        return;
      }
    }
    if (!acra.name) {
      addToast('Please upload ACRA image!', { appearance: 'error' });
      return;
    } else {
      var isValid = false;
      var filename = acra.name;
      var ext = filename.split('.').pop();

      for (const format in validAcraFileFormat) {
        if (ext.toLowerCase() === validAcraFileFormat[format]) {
          isValid = true;
          break;
        }
      }
      if (isValid == false) {
        addToast('Invalid ACRA file format!', { appearance: 'error' });
        return;
      }
    }
    for (const errorKey in errorMsg) {
      if (errorMsg[errorKey] !== '' && errorKey != 'mobile') {
        addToast(errorMsg[errorKey], { appearance: 'error' });
        return;
      }
    }
    if (!captchaValue || captchaValue == '') {
      addToast('Please solve the captcha first', { appearance: 'error' });
      return;
    }

    if (!selectionValue) {
      console.log('selection :', selectionValue);
      addToast('Please read Term of use and privacy policy', {
        appearance: 'error'
      });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    // image list
    formData.append('moh', moh, moh.name);
    if (fields.accountType == 'clinic') {
      console.log('insert clinic smc cert');
      formData.append('smc', smc, smc.name);
    } else {
      console.log('insert vendor wholesale cert');
      formData.append('smc', moh, moh.name);
    }
    formData.append('acra', acra, acra.name);

    for (const key in fields) {
      console.log('print out : ', key);
      if (fields[key] === '' && key != 'mobile') {
        setLoading(false);
        addToast(`Please fill in ${key} field`, { appearance: 'error' });
        recaptchaRef.current?.reset();
        return;
      } else {
        formData.append(key, fields[key]);
      }
    }
    console.log('Sign up data', formData.username);
    axios
      .post(`${process.env.API_URL}/user/signup/${captchaValue}`, formData)
      .then((resp) => {
        if (resp.status === 200) {
          setLoading(false);

          recaptchaRef.current?.reset();
          addToast(
            'Registration successful.\nAn admin will approve your account shortly!',
            { appearance: 'success', autoDismiss: true }
          );
          setTimeout(() => {
            router.push('/');
          }, 1500);
          setFields({
            username: '',
            password: '',
            reTypePassword: '',
            email: '',
            firstName: '',
            lastName: '',
            nationality: '',
            mobile: '',
            phone: '',
            accountType: 'clinic',
            companyName: '',
            companyAddress: '',
            companyPostal: '',
            countryIncorporation: ''
          });
          setMOHLicence({});
          setSMCCert({});
          setAcra({});
          setErrorMsg({
            password: '',
            reTypePassword: ''
          });
        } else {
          setLoading(false);

          recaptchaRef.current?.reset();

          addToast(`${resp.data.error ?? resp.data.errors[0]}`, {
            appearance: 'error'
          });
        }
      })
      .catch((err) => {
        setLoading(false);
        // swalWithBootstrapButtons.fire({
        //   icon: "error",
        //   title: "Error",
        //   text: `${err.response.data.error ?? err.response.data.errors[0]}`,
        //   timer: 1500,
        // });
        recaptchaRef.current?.reset();

        addToast(`${err.response.data.error ?? err.response.data.errors[0]}`, {
          appearance: 'error'
        });
      });
  };
  return (
    <LayoutTwo>
      {/* breadcrumb */}
      <BreadcrumbOne
        pageTitle="Customer Signup"
        backgroundImage="/assets/images/backgrounds/breadcrumb-bg-2.jpg"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.PUBLIC_URL + '/'}>
              <a>Home</a>
            </Link>
          </li>

          <li>Customer Signup</li>
        </ul>
      </BreadcrumbOne>
      <div className="login-area space-mt--r50 space-mb--r50">
        <Container>
          <Row className="justify-content-center">
            <Col lg={6}>
              <div className="lezada-form login-form--register">
                <form>
                  <Row>
                    <Col lg={12}>
                      <div className="section-title--login text-center space-mb--50">
                        <h2 className="space-mb--20">Register</h2>
                        <p>If you don’t have an account, register now!</p>
                      </div>
                    </Col>
                    {formFields.map((item, index) => (
                      <Col lg={12} className="space-mb--30" key={index}>
                        <InputField
                          field={item.field}
                          id={item.id}
                          type={item.type}
                          name={item.name}
                          value={item.value}
                          required={item.required}
                          errorMsg={item.errorMsg}
                          onChange={onChangeHandler}
                        />
                      </Col>
                    ))}
                    {/* Radio buttons */}
                    <Col lg={12} className="space-mb--30">
                      <label className="space-mb--20">Account Type:</label>
                      <InputField
                        field="Clinic"
                        id="clientAccount"
                        type="radio"
                        name="accountType"
                        value="clinic"
                        onChange={onChangeHandler}
                        defaultChecked
                      />
                      <InputField
                        field="Vendor"
                        id="vendorAccount"
                        type="radio"
                        name="accountType"
                        value="vendor"
                        onChange={onChangeHandler}
                      />
                    </Col>
                    <Col lg={12} className="space-mb--50">
                      <label className="space-mb--20">
                        MOH(Clinic) / Relevant(Vendor) licence:
                      </label>
                      <FormFile
                        type="file"
                        // className="form-control-file"
                        id="moh-licence"
                        label={moh.name ?? 'Upload jpeg/png file'}
                        accept=".png,.jpg,.jpeg"
                        onChange={mohChangeHandler}
                        custom
                        //multiple
                      />
                    </Col>
                    <Col lg={12} className="space-mb--50">
                      <label className="space-mb--20">
                        SMC Practicing Certification:
                      </label>
                      <FormFile
                        type="file"
                        // className="form-control-file"
                        name="smc-cert"
                        id="smc-certification"
                        label={smc.name ?? 'Upload jpeg/png file'}
                        accept=".png,.jpg,.jpeg"
                        onChange={smcChangeHandler}
                        custom
                      />
                    </Col>
                    <Col lg={12} className="space-mb--50">
                      <label className="space-mb--20">ACRA image:</label>
                      <FormFile
                        type="file"
                        // className="form-control-file"
                        id="acra-image"
                        label={acra.name ?? 'Upload jpeg/png/pdf file'}
                        accept=".png,.jpg,.jpeg,.pdf"
                        onChange={acraChangeHandler}
                        custom
                      />
                    </Col>
                    <Col lg={12} className="space-mb--50">
                      <input
                        id="policy-text"
                        name="policy-text"
                        type="checkbox"
                        required="true"
                        onChange={setSelectionHandler}
                      />{' '}
                      <label htmlFor="policy-text">
                        I accept the{' '}
                        <b>
                          <a
                            target="_blank"
                            href={
                              process.env.PUBLIC_URL + '/terms-and-conditions'
                            }
                          >
                            Terms of Use
                          </a>
                        </b>{' '}
                        &{' '}
                        <b>
                          <a
                            target="_blank"
                            href={process.env.PUBLIC_URL + '/privacy-policy'}
                          >
                            Privacy Policy
                          </a>
                        </b>
                      </label>
                    </Col>
                    <Col lg={12} className="space-mb--60">
                      <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={process.env.CAPTCHA_KEY}
                        onChange={captchaHandler}
                      />
                    </Col>

                    <Col lg={12} className="text-center space-mb--30">
                      <button
                        className="lezada-button lezada-button--medium"
                        onClick={onSubmitHandler}
                      >
                        {loading ? <Loader /> : 'register'}
                      </button>
                    </Col>
                    <Col lg={12} className="text-center">
                      <span className="signup-link">
                        Already have an account?{' '}
                      </span>
                      <Link
                        className="login-link"
                        href="/user/login"
                        as={process.env.PUBLIC_URL + '/user/login'}
                      >
                        Login
                      </Link>
                    </Col>
                  </Row>
                </form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </LayoutTwo>
  );
};

export default withSingleAuth(Signup);
