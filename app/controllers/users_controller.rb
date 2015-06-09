class UsersController < ApplicationController
  def create
    @user = User.new(user_params)
    if @user.save
      log_in @user
      redirect_to user_url @user
    else
      flash.now[:errors] = @user.errors.full_messages
      render :new
    end
  end

  def new
  end

  def show
    @user = User.find(params[:id])
  end
end
