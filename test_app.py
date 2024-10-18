import pandas as pd
from prophet import Prophet
import os

def find_monthly_average(dataframe):
    try:
        # df = pd.read_csv(csv_path)
        df = dataframe
        df["ds"] = pd.to_datetime(df["ds"])
        df["Month"] = df["ds"].dt.strftime("%Y-%m")
        monthly_avg = df.groupby("Month")["y"].mean().reset_index()
        monthly_avg.columns = ["Month", "Average"]
        return monthly_avg
    except Exception as e:
        print(f"Exception: {e}")


def make_prediction(csv_file):
    dataframe =  pd.read_csv(csv_file)
    dataframe["total_sales"] = dataframe['SalesPrice'] * dataframe['SalesQuantity']
    print(dataframe.head())
    fields = {
        "SalesDate": 'ds',
        "total_sales": 'y'
    }
    dataframe.rename(columns=fields, inplace=True)

    monthly_ave_sale = find_monthly_average(dataframe=dataframe)
    print("Monthy Avg Sale ....................")
    print(monthly_ave_sale.head())


    prophet = Prophet()
    prophet.fit(dataframe)
    prediction = prophet.make_future_dataframe(freq='ME', include_history=False, periods=12)

    future_prediction = prophet.predict(prediction)
    future_prediction = future_prediction.rename(columns={
        'ds': 'Date',
        'yhat': 'Forecast'
    })
    future_prediction['Actual'] = dataframe['y']
    future_prediction['Product'] = dataframe['Description']
    future_prediction.to_csv('prediction.csv', index=False)


if __name__ == '__main__':

    csv_file = "uploads/SalesFINAL12312016.csv"

    if os.path.exists(csv_file):
        make_prediction(csv_file= csv_file)