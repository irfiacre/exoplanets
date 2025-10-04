import requests

BASE_URL = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync"


def look_up_planet_name(name: str) -> dict:
    """
    Searches for a planet name and returns all planets that match the planet name.

    Args:
        name (str): The name of the planet to use as a search query.

    Returns:
        dict: of the following parameters
        - status: informs if the request was successful or not.
        - message: in case of an error, this will be the error.
        - result: the result of the search query, the result is an array/list of items from the Database, you can information about the columns here - https://exoplanetarchive.ipac.caltech.edu/docs/API_PS_columns.html.
    """
    try:
        sql = f"select * from ps where pl_name like '{name}' or hostname like '{name}'"
        params = {"query": sql, "format": "json"}
        response = requests.get(BASE_URL, params=params, timeout=30)
        print(response.json())
        return {
            "status": "success",
            "message": "All is well",
            "result": response.json(),
        }

    except Exception as e:
        error_msg = f"Error: {str(e)}"
        return {"status": "error", "message": error_msg, "result": None}
