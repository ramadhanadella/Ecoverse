import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Ecoverse"
        description="ini adalah halaman Sign In dari website Ecoverse"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
