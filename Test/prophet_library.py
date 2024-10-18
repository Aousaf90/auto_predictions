import pandas as pd
from prophet import Prophet
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import JsonOutputParser




def llama_chatbot(csv_data: list ):
    json_format = """
        {
             'fields': ['field1', 'field2',...]
        }
        """
    formatted_data = "\n".join([str(item) for item in csv_data])
    prompt = ChatPromptTemplate.from_messages([
        ("user", """Given the provided CSV data, please identify and list
         2 potential fields that can be utilized to represent values on a graph.
         The value should be of numaric type and it can also be used for prediction through prophet library.
         Mostly for prediction we use one value for datetime and other something else.
        Note: One of the fields should be date
         CSV Data:
         {formatted_data}

         return only fields name no extra words
         return in JSON format:
         {json_format}
         """)
    ])
    model = ChatGroq(
        model="llama3-8b-8192",
        temperature=0,
        max_tokens=None,
        timeout=None,
        max_retries=2,
        api_key="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"
    )
    output_parser = JsonOutputParser()
    chain = prompt | model | output_parser
    stream = chain.invoke({
        "formatted_data": formatted_data,
        "json_format":json_format
    })
    print(stream)
    return stream

dataframe = pd.read_csv("uploads/EndInvFINAL12312016.csv")
fields = llama_chatbot(dataframe.to_dict(orient="records")[:5])
print(f"Date Field: {fields['fields'][0]}")
print(f"Value Field: {fields['fields'][1]}")

dataframe.rename(columns={fields['fields'][1]: 'y', fields['fields'][0]: 'ds'}, inplace=True)

print(f"Fields: {fields}")
# print(f"Dataframe: {dataframe.head()}")
try:
    m = Prophet()
    m.fit(dataframe)

    future = m.make_future_dataframe(periods=365)
    print(f"Future: {future}")
except Exception as e:
    print(f"Error: {e}")