import React from 'react';
import { NextPageContext } from 'next';
import Error from 'next/error';

interface ErrorPageProps {
  statusCode: number;
  err?: {
    message?: string;
  };
}

export default class ErrorPage extends React.Component<ErrorPageProps> {
  static async getInitialProps(context: NextPageContext) {
    const errorInitialProps = await Error.getInitialProps(context);
    return {
      ...errorInitialProps,
      statusCode: errorInitialProps.statusCode || 500
    };
  }

  render() {
    return (
      <Error
        statusCode={this.props.statusCode}
        title="An error occurred"
      />
    );
  }
}
